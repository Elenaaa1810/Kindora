<!DOCTYPE html>
<html>
<head>
    <title>Kindora Membership Update</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f7fafd; padding: 30px;">

    <div style="max-width: 600px; margin: auto; background: white;
                padding: 30px; border-radius: 12px;">

        <h2 style="color: #438fc4;">Kindora</h2>

        <p>Dear {{ $member->full_name }},</p>

        @if($status === 'approved')

            <h2 style="color: #059669;">
                Congratulations! Your Application Has Been Approved!
            </h2>

            <p>
                We are happy to inform you that your volunteer membership
                application has been approved.
            </p>

            <p>
                You are now officially a member of Kindora.
                You can log in to your account and explore available
                volunteer campaigns.
            </p>

        @else

            <h2 style="color: #e11d48;">
                Update on Your Membership Application
            </h2>

            <p>
                Thank you for your interest in joining Kindora.
                After reviewing your application, we regret to inform
                you that your membership application has not been
                approved at this time.
            </p>

            <div style="background: #fff1f2; padding: 15px; border-radius: 8px;">
                <strong>Reason for rejection:</strong>

                <p>{{ $rejectionReason }}</p>
            </div>

        @endif

        <p>
            Thank you for your interest in supporting our community.
        </p>

        <p>
            Best regards,<br>
            <strong>Kindora Team</strong>
        </p>

    </div>

</body>
</html>