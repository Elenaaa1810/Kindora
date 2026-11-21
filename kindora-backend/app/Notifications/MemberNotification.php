<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MemberNotification extends Notification
{
    use Queueable;

    protected $notificationData;

    public function __construct(array $data)
    {
        $this->notificationData = $data;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return $this->notificationData;
    }
}
