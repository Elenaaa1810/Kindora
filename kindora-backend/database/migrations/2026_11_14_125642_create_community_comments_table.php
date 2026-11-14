<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('community_comments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('post_id')
                ->constrained('community_posts')
                ->cascadeOnDelete();

            $table->foreignId('member_id')
                ->constrained('members')
                ->cascadeOnDelete();

            $table->foreignId('parent_comment_id')
                ->nullable()
                ->constrained('community_comments')
                ->cascadeOnDelete();

            $table->text('content');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('community_comments');
    }
};