class Pages < Application

  before :redirect_from_old_handle, :only => [:show]

  def show(handle)
    if request.env['REQUEST_PATH'] =~ %r{/$}
      redirect '/' / params[:page]
    end

    @page = Page.get_by_handle!(handle)

    @headers['Cache-control'] = "no-cache"
    render
  end

  def create
    @page = Page.new
    @page.save

    redirect "/" / @page.handle
  end
  
  def update(handle, body)
    @page = Page.get_by_handle!(handle)

    @page.body = body
    @page.save

    render "Updated"
  end

  def move(handle, new_handle)
    @page = Page.get_by_handle!(handle)
    
    if @page.move(new_handle)
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
  
protected
  def redirect_from_old_handle
    puts "redirect_from_old_handle #{params[:handle]} #{Page.count}"
    OldHandle.first(:name => params[:handle]).andand do |old_handle|
      redirect "/" / old_handle.page.handle, :permanent => true
      throw :halt
    end
  end
end
