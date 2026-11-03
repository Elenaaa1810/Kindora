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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();

            $table->string('title', 100);
            $table->string('category', 50);
            $table->date('date');
            $table->time('time');
            $table->string('location', 150);
            $table->unsignedInteger('capacity')->default(30);
            $table->text('description');

            $table->enum('status', ['Upcoming', 'Completed'])
                  ->default('Upcoming');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};