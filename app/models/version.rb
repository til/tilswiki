class Version
  include DataMapper::Resource
  
  property :id,         Serial
  property :created_at, DateTime
  property :number,     Integer
  property :body,       Text

  belongs_to :page

end
