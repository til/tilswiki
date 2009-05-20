require 'html_to_text'

class Versions < Application
  
  def index(handle)
    @page = Page.get_by_handle!(handle)
    
    display @page.versions
  end
end
