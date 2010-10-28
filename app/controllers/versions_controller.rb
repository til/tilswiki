require 'html_to_text'

class VersionsController < ApplicationController
  
  def index
    @page = Page.get_by_handle!(params[:page_id])
    
    render(:json => 
      @page.versions.map do |v|
        { 'created_at' => v.created_at.to_s(:db), 'number' => v.number }
      end
    )
  end
end
