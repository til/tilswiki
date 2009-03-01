class Version
  include DataMapper::Resource
  
  property :id,         Serial
  property :created_at, DateTime
  property :body,       Text

  belongs_to :page

end
