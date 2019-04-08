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

abstract class AbstractCatalogCommand extends Command
{
    const DEFAULT_LOCALE = "en-US";

    const TRANSLATIONS_DIR = "l10n";

    private $extractorOptions = ['functions' => [
        't' => 'gettext',
        'x' => 'pgettext',
        'n' => 'ngettext'
    ]];

    /**
     * @var Filesystem
     */
    protected $filesystem;

    /**
     * @var string
     */
    protected $workdir;

    /**
     * @var array
     */
    protected $packageJson;

    /**
     * @var array
     */
    protected $locales;

    public function __construct($workdir)
    {
        parent::__construct();
        $this->filesystem = new Filesystem();
        $this->workdir = $workdir;
    }

    protected function getPackageJson()
    {
        if (is_null($this->packageJson))
        {
            $packageJsonFile = "{$this->workdir}/package.json";

            if (!$this->filesystem->exists($packageJsonFile))
            {
                throw new Exception("The package.json file was expected at $packageJsonFile but not found.");
            }

            $this->packageJson = (array)json_decode(file_get_contents($packageJsonFile), true);
        }

        return $this->packageJson;
    }

    protected function getPackageJsonKey(string $key)
    {
        $packageJson = $this->getPackageJson();

        if (!isset($packageJson["l10n"]) || !isset($packageJson["l10n"][$key]))
            throw new Exception("The key $key is missing in the `l10n` entry in your package.json file.");

        return $packageJson["l10n"][$key];
    }

    protected function getLocales() : array
    {
        if (is_null($this->locales))
        {
            $this->locales = [];

            foreach ((array)$this->getPackageJsonKey("locales") as $locale)
            {
                if (! is_string($locale) || ! preg_match('|^[a-z]{2}-[A-Z]{2}$|', $locale))
                {
                    throw new Exception("Your locales are invalid.");
                }

                $this->locales[] = $locale;
            }
        }

        return $this->locales;
    }

    protected function createCatalog(string $locale, array $files = null) : Translations
    {
        $catalog = new Translations();
        $catalog->deleteHeaders();
        $catalog->setLanguage(str_replace("-", "_", $locale));


        if ($files)
        {
            foreach ($files as $file)
            {
                $catalog->addFromJsCodeFile($file, $this->extractorOptions);
            }
        }

        return $catalog;
    }
}
