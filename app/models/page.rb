require 'base62'

class Page
  include DataMapper::Resource
  
  property :id,  Serial
  property :created_at, DateTime

  property :handle, String, :nullable => false, 
                            :default => proc { Base62.rand }
  
  has n, :versions

  after :save, :save_new_version

  def initialize
    new_version
    self.body = "foo"
  end

  def title
    "A Title"
  end
  
  def body
    latest_version.body
  end
  
  def body=(body)
    new_version.body = body
  end
  
  def new_version
    @new_version ||= versions.build
  end
  
  def latest_version
    @new_version || versions.first(:order => [:created_at.desc])
  end
  
protected

  def save_new_version
    if @new_version
      @new_version.save
      @new_version = nil
    end
  end
end
