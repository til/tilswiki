class OldHandle
  include DataMapper::Resource
  
  property :id, Serial
  property :created_at, DateTime
  property :name, String
  
  belongs_to :page

  def to_s
    name
  end
end
