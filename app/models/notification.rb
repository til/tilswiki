class Notification
  include DataMapper::Resource

  property :id,              Serial
  property :created_at,      DateTime
  property :subscription_id, Integer

end
