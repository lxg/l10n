#!/usr/bin/env php
<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/src/AbstractCatalogCommand.php';
require_once __DIR__ . '/src/ExtractCommand.php';
require_once __DIR__ . '/src/TablesCommand.php';

use Symfony\Component\Console\Application;
use Opis\JsonSchema\{
    Validator, ValidationResult, ValidationError, Schema
};

try
{
    $workdir = getcwd();
    $config = loadConfig($workdir);

    $application = new Application("Catalog Manager");
    $application->add(new ExtractCommand($workdir, $config));
    $application->add(new TablesCommand($workdir, $config));
    $application->run();
}
catch (Exception $e)
{
    printf("ERROR: %s\n", $e->getMessage());
}

function  loadConfig($workdir)
{
   $packageJsonFile = "$workdir/package.json";

    if (!file_exists($packageJsonFile))
    {
        throw new Exception("The package.json file was expected at $packageJsonFile but not found.");
    }

    $packageJson = json_decode(file_get_contents($packageJsonFile));

    if (!property_exists($packageJson, "l10n"))
        throw new Exception("The `l10n` entry is missing from your package.json file.");

    $config = $packageJson->l10n;
    $schema = Schema::fromJsonString(file_get_contents(__DIR__ . '/src/schema.json'));

    $validator = new Validator();

    /** @var ValidationResult $result */
    $result = $validator->schemaValidation($config, $schema);

    if (!$result->isValid())
    {
        /** @var ValidationError $error */
        $error = $result->getFirstError();

        $message = sprintf("Your `l10n` entry in package.json is invalid: %s\n",
            $error->keyword(),
            json_encode($error, JSON_PRETTY_PRINT));

        throw new Exception($message);
    }

    return $config;
}
