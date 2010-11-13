class PagesController < ApplicationController

  before_filter :redirect_from_old_handle, :only => [ :show ]

  def index
    render 'welcome/index'
  end

  def show
    @page = Page.get_by_handle!(params[:id])
    if params[:version]
      @version = @page.versions(:number => params[:version]).first or
        raise DataMapper::ObjectNotFoundError
      @page.version = @version
    end

    headers['Cache-control'] = "no-cache"
    if request.xhr?
      render :text => @page.body
    else
      render
    end
  end

  def create
    @page = Page.new
    @page.save
    
    if request.xhr?
      render :json => { :location => page_url(@page)}
    else
      redirect_to @page
    end
  end
  
  def update
    @page = Page.get_by_handle!(params[:id])

    if new_handle = params[:page][:handle]
      if @page.relocate(new_handle)
        redirect_to page_path(@page.reload)
      else
        render :text => "Sorry, this name is already in use", :status => 409 # Conflict
      end
      return
    end
    
    if params[:page][:version_number].to_i != @page.latest_version.number
      render :text => "Conflict", :status => 409
      return
    end

    @page.body = params[:page][:body]
    @page.save

    render :json => { :version_number => @page.latest_version.number }
  end
  
  def insert_link
    render :layout => false
  end

protected
  def redirect_from_old_handle
    OldHandle.first(:name => params[:id]).andand do |old_handle|
      redirect_to page_path(old_handle.page), :status => :moved_permanently
    end
  end
end
