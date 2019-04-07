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

    protected function getLocales() : array
    {
        $packageJson = $this->getPackageJson();

        return (isset($packageJson["l10n"]) && isset($packageJson["l10n"]["locales"]) && is_array($packageJson["l10n"]["locales"]))
            ? $packageJson["l10n"]["locales"]
            : [];
    }
}
