<?php

namespace MatematCmsfly\CmsflyFileManager\Traits;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

trait SearchTrait
{
    public function getSearchContent($disk, $search)
    {
        $allFiles = Storage::disk($disk)->allFiles();
        $allDirectories = Storage::disk($disk)->allDirectories();

        $files = collect($allFiles)
            ->filter(fn ($file) => str_contains(File::name($file), $search))
            ->map(fn ($file) => [
                'type' => 'file',
                'path' => $file,
                'basename' => File::name($file).'.'.File::extension($file),
                'dirname' => File::dirname($file) == '.' ? '' : File::dirname($file),
                'extension' => File::extension($file),
                'filename' => File::name($file),
                'size' => Storage::disk($disk)->size($file),
                'timestamp' => Storage::disk($disk)->lastModified($file),
                'visibility' => Storage::disk($disk)->getVisibility($file),
            ])
            ->values()
            ->toArray();

        $directories = collect($allDirectories)
            ->filter(fn ($dir) => str_contains(File::name($dir), $search))
            ->map(fn ($dir) => [
                'type' => 'dir',
                'path' => $dir,
                'basename' => File::name($dir),
                'dirname' => File::dirname($dir) == '.' ? '' : File::dirname($dir),
                'timestamp' => Storage::disk($disk)->lastModified($dir),
                'visibility' => Storage::disk($disk)->getVisibility($dir),
            ])
            ->values()
            ->toArray();

        return [
            'directories' => $directories,
            'files' => $files,
        ];
    }
}
