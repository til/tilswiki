class Pages < Application

  def show(handle)
    if request.env['REQUEST_PATH'] =~ %r{/$}
      redirect '/' / params[:page]
    end

    @page = Page.first(:handle => handle) or raise DataMapper::ObjectNotFoundError

    @headers['Last-modified'] = @page.updated_at.to_time.httpdate
    @headers['Cache-control'] = "no-cache"
    if request.ajax?
      render @page.body, :layout => false
    else
      render
    end

  rescue DataMapper::ObjectNotFoundError
    raise NotFound
  end

  def create
    @page = Page.new
    @page.save

    redirect "/" / @page.handle
  end
  
  def update(handle, body)
    @page = Page.first(:handle => handle) or raise DataMapper::ObjectNotFoundError

    @page.body = body
    @page.save

    render "Updated"
  end

  def upload(handle)
    @assets = (params[:files] || []).
      reject(&:blank?).
      collect { |file| Asset.create(handle, file) }
    
    render :status => 201
  end
end
