require 'base62'

class Subscription
  include DataMapper::Resource

  property :id,         Serial
  property :created_at, DateTime

  property :page,       String, :nullable => false
  property :secret,     String, :nullable => false, 
                                :default => proc { Base62.rand }
  property :email,      String, :nullable => false,
                                :format => :email_address

  has n, :notifications

  def self.notify_all!
    all.
      select do |subscription|
        # Limit to recently updated pages
        File.mtime(Merb.root / 'pages' / "#{subscription.page}.html") > 1.hour.ago
      end.reject do |subscription|
        # Reject those who have already been notified
        Notification.first(:subscription_id => subscription.id, :created_at.gt => 1.hour.ago)
      end.each do |subscription|
        NotificationsMailer.dispatch_and_deliver(
          :notify,
          { :From => 'tilswiki mailbot <noreply@wiki.tils.net>', :To => subscription.email,
            :Subject => "[tilswiki] #{subscription.page} has been updated" },
          { :subscription => subscription }
        )
        subscription.notifications.create
      end
  end

end
