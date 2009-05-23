class Pages < Application

  before :redirect_from_old_handle, :only => [:show]

  def show(handle)
    if request.env['REQUEST_PATH'] =~ %r{/$}
      redirect '/' / params[:page]
    end

    @page = Page.get_by_handle!(handle)
    if params[:version]
      @version = @page.versions(:number => params[:version]).first or
        raise DataMapper::ObjectNotFoundError
      @page.version = @version
    end

    @headers['Cache-control'] = "no-cache"
    if request.xhr?
      return @page.body
    else
      render
    end
  end

  def create
    provides :html, :json

    @page = Page.new
    @page.save
    location = request.protocol + '://' + request.host / @page.handle

    if request.xhr?
      display({ :location => location})
    else
      redirect location
    end
  end
  
  def update(handle, body)
    @page = Page.get_by_handle!(handle)

    @page.body = body
    @page.save

    render "Updated"
  end

  def relocate(handle, new_handle)
    @page = Page.get_by_handle!(handle)
    
    if @page.relocate(new_handle)
      redirect "/" / @page.reload.handle
    else
      render "Sorry, this name is already in use", :status => 409 # Conflict
    end
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
    OldHandle.first(:name => params[:handle]).andand do |old_handle|
      redirect "/" / old_handle.page.handle, :permanent => true
      throw :halt
    end
  end
end
