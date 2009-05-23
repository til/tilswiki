require 'base62'
require 'html_to_text'

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

  def initialize(*args)
    new_version
    self.body = <<-HTML
      <h1>#{default_title}</h1>
      <p>Type your text here ...</p>
    HTML
    super
  end

  def title
    title = nil
    if body =~ %r{<h1>(.*?)</h1>}im
      title = html_to_text($1)
    end
    
    title = nil if title == default_title

    title || "A tilswiki page"
  end
  
  def default_title
    "Type your title here"
  end

  def relocate(new_handle)
    return false if OldHandle.first(:name => new_handle)
    return false if Page.first(:handle => new_handle)

    old_handles.create(:name => self.handle)
    self.handle = new_handle
    save
  end

  def body
    version.body
  end
  
  def body=(body)
    new_version.body = body
  end
  
  def version=(version)
    @version = version
  end

  def version
    @version ||= (latest_version || new_version)
  end

  def new_version
    @new_version ||= versions.build(
      :number => (latest_version.andand.number || 0)  + 1)
  end
  
  def latest_version
    versions.first(:order => [:number.desc])
  end

  def updated_at
    latest_version.andand.created_at
  end
  
protected

  def save_new_version
    if @new_version
      @new_version.save
      @new_version = nil
      @version = nil
    end
  end
end
