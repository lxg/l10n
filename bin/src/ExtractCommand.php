<?php

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

class ExtractCommand extends AbstractCatalogCommand
{
    protected function configure()
    {
        $this
            ->setName('extract')
            ->setDescription('Extract translatable strings into a translation table (.po format).')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $files = array_flip($this->getSourceFiles($this->getPackageJsonKey("extract")));

        foreach ($this->getLocales() as $locale)
        {
            if ($locale !== static::DEFAULT_LOCALE)
            {
                $catalogFile = sprintf("%s/%s/%s.po", $this->workdir, static::TRANSLATIONS_DIR, $locale);
                $catalog = $this->fillCatalog($locale, $catalogFile, $files);
                $this->filesystem->dumpFile($catalogFile, $catalog->toPoString());
            }
        }
    }

    private function fillCatalog(string $locale, string $catalogFile, array $files) : Translations
    {
        $catalog = $this->createCatalog($locale, $files);

        $oldCatalog = ($this->filesystem->exists($catalogFile))
            ? $this->deleteReferences(Translations::fromPoFile($catalogFile))
            : new Translations();

        $catalog->mergeWith($oldCatalog, 0);

        return $catalog;
    }

    private function deleteReferences(Translations $translations) : Translations
    {
        foreach ($translations as $translation)
        {
            $translation->deleteReferences();
        }

        return $translations;
    }
}
