<?php declare(strict_types=1);

use Gettext\Translations;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

abstract class AbstractCatalogCommand extends Command
{
    const DEFAULT_LOCALE = 'en-US';

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

    private $extractorOptions = ['functions' => [
        't' => 'gettext',
        'x' => 'pgettext',
        'n' => 'ngettext'
    ]];

    public function __construct(string $workdir, $config)
    {
        parent::__construct();
        $this->workdir = $workdir;
        $this->config = (object)$config;
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
            $alias = str_replace("{$this->workdir}/", '', $filePath);
            $files[$filePath] = $alias;
        }

        return $files;
    }

    protected function createCatalog(string $locale, array $files = null) : Translations
    {
        $catalog = new Translations();
        $catalog->deleteHeaders();
        $catalog->setLanguage(str_replace('-', '_', $locale));

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
