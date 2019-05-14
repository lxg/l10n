<?php declare(strict_types=1);

use Gettext\Translations;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ExtractCommand extends AbstractCatalogCommand
{
    protected function configure()
    {
        $this
            ->setName('extract')
            ->setDescription('Extracts translatable strings into a translation table (.po format).');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $files = array_flip($this->getSourceFiles($this->config->extract));

        foreach ($this->config->locales as $locale)
        {
            if ($locale !== static::DEFAULT_LOCALE)
            {
                $catalogFile = sprintf('%s/%s/%s.po', $this->workdir, $this->config->directory, $locale);
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
