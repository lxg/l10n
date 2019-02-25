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
use Symfony\Component\HttpKernel\Config\FileLocator;
use Symfony\Component\Console\Application;

class ExtractCommand extends Command
{
    const DEFAULT_LOCALE = "en-US";

    const TRANSLATIONS_DIR = "l10n";

    private $extractorOptions = ['functions' => [
        't' => 'gettext',
        'x' => 'pgettext',
        'n' => 'ngettext'
    ]];

    protected function configure()
    {
        $this
            ->setName('extract')
            ->setDescription('Extract translatable strings into a translation table (.po format).')
            ->addOption("locale", "l", InputOption::VALUE_REQUIRED | InputOption::VALUE_IS_ARRAY, "set one or more locales to maintain by using the -l/--locale option")
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $cwd = getcwd();
        $filesystem = new Filesystem();
        $locales = $input->getOption('locale');

        if (!$locales)
            throw new Exception("At least one locale must be given!");

        $finder = (new Finder())->in($cwd)
            ->name("*\.js")
            ->name("*\.mjs")
            ->notPath('|' . static::TRANSLATIONS_DIR . '/|')
            ->notPath('|node_modules|');

        $files = [];

        foreach ($finder as $file)
        {
            $filePath = $file->getRealpath();
            $alias = str_replace("$cwd/", "", $filePath);
            $files[$filePath] = $alias;
        }

        $frontendCatalogs = [];

        foreach ($locales as $locale)
        {
            if (! preg_match('|^[a-z]{2}-[A-Z]{2}|', $locale))
            {
                throw new Exception("Invalid locale: $locale");
            }

            $catalogFile = sprintf("$cwd/%s/$locale.po", static::TRANSLATIONS_DIR);
            $oldCatalog = ($filesystem->exists($catalogFile))
                ? $this->deleteReferences(Translations::fromPoFile($catalogFile))
                : new Translations();

            $catalog = new Translations();
            $catalog->deleteHeaders();
            $catalog->setLanguage(str_replace("-", "_", $locale));

            foreach ($files as $file)
            {
                $catalog->addFromJsCodeFile($file, $this->extractorOptions);
            }

            $catalog->mergeWith($oldCatalog, 0);
            $filesystem->dumpFile($catalogFile, $catalog->toPoString());
        }
    }

    private function deleteReferences(Translations $translations)
    {
        foreach ($translations as $translation)
        {
            $translation->deleteReferences();
        }

        return $translations;
    }
}
