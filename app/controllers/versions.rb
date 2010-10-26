require 'html_to_text'

class Versions < ApplicationController
  
  def index(handle)
    @page = Page.get_by_handle!(handle)
    
    display @page.versions, :only => [:number, :created_at]
  end
end
