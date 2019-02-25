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

class ExtractCommand extends Command
{
    const DEFAULT_LOCALE = "en-US";

    const TRANSLATIONS_DIR = "l10n";

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * @var string
     */
    private $workdir;

    private $extractorOptions = ['functions' => [
        't' => 'gettext',
        'x' => 'pgettext',
        'n' => 'ngettext'
    ]];

    public function __construct()
    {
        parent::__construct();
        $this->filesystem = new Filesystem();
        $this->workdir = getcwd();
    }

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
        $locales = $input->getOption('locale') ?: $this->getLocalesFromPackage();
        $files = $this->getSourceFiles();

        foreach ($locales as $locale)
        {
            $catalogFile = sprintf("%s/%s/%s.po", $this->workdir, static::TRANSLATIONS_DIR, $locale);
            $catalog = $this->createCatalog($locale, $catalogFile, $files);
            $this->filesystem->dumpFile($catalogFile, $catalog->toPoString());
        }
    }

    private function getLocalesFromPackage() : array
    {
        $packageJsonFile = __DIR__ . "/../../package.json";

        if ($this->filesystem->exists($packageJsonFile))
        {
            $packageJson = json_decode(file_get_contents($packageJsonFile), true);

            if (isset($packageJson["l10n"]) && isset($packageJson["l10n"]["locales"]) && is_array($packageJson["l10n"]["locales"]))
                $locales = $packageJson["l10n"]["locales"];
        }

        if (!$locales)
            throw new Exception("At least one locale must be given!");

        return $locales;
    }

    private function getSourceFiles() : array
    {
        $files = [];
        $finder = (new Finder())->in($this->workdir)
            ->name("*\.js")
            ->name("*\.mjs")
            ->notPath('|' . static::TRANSLATIONS_DIR . '/|')
            ->notPath('|node_modules|');

        foreach ($finder as $file)
        {
            $filePath = $file->getRealpath();
            $alias = str_replace("{$this->workdir}/", "", $filePath);
            $files[$filePath] = $alias;
        }

        return $files;
    }

    private function createCatalog(string $locale, string $catalogFile, array $files) : Translations
    {
        if (! preg_match('|^[a-z]{2}-[A-Z]{2}|', $locale))
        {
            throw new Exception("Invalid locale: $locale");
        }

        $oldCatalog = ($this->filesystem->exists($catalogFile))
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
