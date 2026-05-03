<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('profiles', function (Blueprint $table) {
        $table->string('education')->nullable()->change();
    });
}

public function down(): void
{
    Schema::table('profiles', function (Blueprint $table) {
        $table->enum('education', ['SD','SMP','SMA','D3','S1','S2','S3'])
              ->nullable()->change();
    });
}
};
