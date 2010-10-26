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
      return @page.body
    else
      return @page
    end
  end

  def create
    @page = Page.new
    @page.save
    #location = request.protocol + '://' + request.host + '/' + @page.handle

    if request.xhr?
      display({ :location => location})
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

    @page.body = params[:page][:body]
    @page.save

    render :text => "Updated"
  end

  def upload(handle)
    @assets = (params[:files] || []).
      reject(&:blank?).
      collect { |file| Asset.create(handle, file) }
    
    render :status => 201
  end
  
  def insert_link
    render :layout => false
  end

protected
  def redirect_from_old_handle
    OldHandle.first(:name => params[:id]).andand do |old_handle|
      redirect "/" / old_handle.page.handle, :permanent => true
      throw :halt
    end
  end
end
