
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();

            // Account information
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('password');

            // Personal information
            $table->string('phone')->nullable();
            $table->string('location')->nullable();

            // Volunteer application
            $table->text('reason');
            $table->text('motivation');
            $table->json('interests');
            $table->boolean('previous_experience')->default(false);
            $table->text('experience_details')->nullable();
            $table->string('availability');

            // Admin approval
            $table->string('status')->default('pending');
            $table->text('rejection_reason')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
