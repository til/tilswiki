require 'base62'

class Page
  include DataMapper::Resource
  
  property :id,  Serial
  property :created_at, DateTime

  property :handle, String, :nullable => false, 
                            :default => proc { Base62.rand }
  
  has n, :versions
  has n, :old_handles

  after :save, :save_new_version

  def self.get_by_handle!(handle)
    first(:handle => handle) or raise DataMapper::ObjectNotFoundError
  end

  def initialize
    new_version
    self.body = <<-HTML
      <h1>Page Title</h1>
      <p>Type your text here ...</p>
    HTML
  end

  def title
    if body =~ %r{<h1>(.*?)</h1>}im
      $1.gsub(/\s+/, ' ').strip
    else
      "A tilswiki page"
    end
  end
  
  def relocate(new_handle)
    return false if OldHandle.first(:name => new_handle)
    return false if Page.first(:handle => new_handle)

    old_handles.create(:name => self.handle)
    self.handle = new_handle
    save
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

  def updated_at
    latest_version.created_at
  end
  
protected

  def save_new_version
    if @new_version
      @new_version.save
      @new_version = nil
    end
  end
end
