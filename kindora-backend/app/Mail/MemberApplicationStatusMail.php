<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MemberApplicationStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $member;
    public $status;
    public $rejectionReason;

    public function __construct($member, $status, $rejectionReason = null)
    {
        $this->member = $member;
        $this->status = $status;
        $this->rejectionReason = $rejectionReason;
    }

    public function build()
    {
        $subject = $this->status === 'approved'
            ? 'Your Kindora Membership Application Has Been Approved!'
            : 'Update on Your Kindora Membership Application';

        return $this->subject($subject)
                    ->view('emails.member-application-status');
    }
}