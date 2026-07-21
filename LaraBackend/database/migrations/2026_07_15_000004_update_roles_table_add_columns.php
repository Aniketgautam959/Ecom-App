<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('roles')) {
            Schema::table('roles', function (Blueprint $table) {
                if (! Schema::hasColumn('roles', 'name')) {
                    $table->string('name')->after('id');
                }
                if (! Schema::hasColumn('roles', 'slug')) {
                    $table->string('slug')->unique()->after('name');
                }
                if (! Schema::hasColumn('roles', 'description')) {
                    $table->text('description')->nullable()->after('slug');
                }
                if (! Schema::hasColumn('roles', 'permissions')) {
                    $table->json('permissions')->nullable()->after('description');
                }
                if (! Schema::hasColumn('roles', 'status')) {
                    $table->boolean('status')->default(true)->after('permissions');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('roles')) {
            Schema::table('roles', function (Blueprint $table) {
                $table->dropColumn(['name', 'slug', 'description', 'permissions', 'status']);
            });
        }
    }
};
