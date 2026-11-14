<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('community_post_likes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('post_id')
                ->constrained('community_posts')
                ->cascadeOnDelete();

            $table->foreignId('member_id')
                ->constrained('members')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['post_id', 'member_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('community_post_likes');
    }
};