<?php

use Gettext\Merge;
use Gettext\Translation;
use Gettext\Translations;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Console\Application;

class TablesCommand extends AbstractCatalogCommand
{
    protected function configure()
    {
        $this
            ->setName('tables')
            ->setDescription('Creates translation tables for sets of source files as specified in the package.json.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $locales = $this->getLocales();

        foreach ($this->getPackageJsonKey("tables") as $targetFile => $sources)
        {
            /**
             * @var Translations[]
             */
            $catalogs = $this->createCatalogs($locales, $sources);
            $tables = array_fill_keys($locales, []);

            foreach ($catalogs as $locale => $catalog)
            {
                foreach ($catalog as $entry)
                {
                    $msgid = ltrim($entry->getId(), "\004");
                    $msgstr = $entry->getTranslation();

                    $trans = $entry->hasPlural()
                        ? array_merge([$msgstr], $entry->getPluralTranslations())
                        : $msgstr;

                    $tables[$locale][$msgid] = $trans;
                }
            }

            $this->filesystem->dumpFile(
                "$this->workdir/$targetFile",
                json_encode($tables, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            );
        }
    }

    private function createCatalogs(array $locales, array $sources)
    {
        // how we process the map of sources:
        // - first we resolve all patterns to a list of file paths
        // - for each file in the path, we try to find the translation catalogs
        // - we create a dummy catalog containing all translations we need
        // - we merge all translations we actually have into that catalog

        $files = $this->getSourceFiles($sources);
        $catalogs = [];

        foreach ($locales as $locale)
        {
            $catalogs[$locale] = new Translations();
        }

        foreach ($files as $file => $alias) {
            $packageCatalogs = $this->getPackageCatalogs($file, $locales);

            foreach ($packageCatalogs as $locale => $packageCatalog)
            {
                // this is a dummy catalog containing only the translations needed in the file.
                // we will now merge this catalog with the entire catalog of the respective package to get the intersection.
                $fileCatalog = $this->createCatalog($locale, [$file]);
                $fileCatalog->mergeWith($packageCatalog, 0);
                $catalogs[$locale]->mergeWith($fileCatalog, Merge::ADD);
            }
        }

        return $catalogs;
    }

    private function getPackageCatalogs($path, $locales) : array
    {
        // we assume that the file is part of some package. Therefore we search for
        // a directory containing a the package.json file. In this directory, we expect
        // the l10n directory with the translation files.

        $catalogs = [];

        while ($path !== "/") // TODO: What happens on Windows? Infinite loop?
        {
            $path = dirname($path);

            if ($this->filesystem->exists("$path/package.json"))
            {
                foreach ($locales as $locale)
                {
                    $catalogFile = "$path/{$this->translationsDir}/$locale.po";

                    if ($this->filesystem->exists($catalogFile))
                    {
                        $catalogs[$locale] = Translations::fromPoFile($catalogFile);
                    }
                }

                // In any case, break here. Because everything deeper is the parent package.
                break;
            }
        }

        return $catalogs;
    }
}
