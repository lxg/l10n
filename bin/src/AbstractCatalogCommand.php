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
    protected $config;

    public function __construct(string $workdir, object $config)
    {
        parent::__construct();
        $this->workdir = $workdir;
        $this->config = $config;
        $this->filesystem = new Filesystem();
    }

    /**
     * Creates a list of files from a list of Finder patterns
     * @param  string[] $sources list of Finder patterns
     * @return string[] list of actual files
     */
    protected function getSourceFiles(array $sources)
    {
        /**
        * @var Finder
        */
        $finder = (new Finder())->in($this->workdir);
        $files = [];

        foreach ($sources as $source)
        {
            $finder->path($source);
        }

        foreach ($finder as $file)
        {
            $filePath = $file->getRealpath();
            $alias = str_replace("{$this->workdir}/", "", $filePath);
            $files[$filePath] = $alias;
        }

        return $files;
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
