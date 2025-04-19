<?php

namespace MatematCmsfly\CmsflyFileManager;

use Spatie\LaravelPackageTools\Commands\InstallCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class CmsflyFileManagerServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        $package
            ->name('cmsfly-file-manager')
            ->hasConfigFile(['cmsfly-file-manager', 'file-manager'])
            ->hasInertiaComponents()
            ->hasRoutes(['web'])
            ->hasInstallCommand(function (InstallCommand $command) {
                $command
                    ->publishInertiaComponents();

            });
    }

    public function packageRegistered(): void
    {

    }

    public function packageBooted(): void
    {

    }
}
