class Pages < Application

  def show
    if request.env['REQUEST_PATH'] =~ %r{/$}
      redirect '/' / params[:page]
    end

    @content = File.read(html_file_path(params[:page]))
    
    @title = if @content =~ %r{^\s*<h1>(.*?)</h1>}
               $1.gsub(/<[^>]+>/, '')
             else
               params[:page]
             end
    
    @headers['Cache-control'] = "no-cache"
    

    render
    
  rescue Errno::ENOENT
    render "Not found", :status => 404, :format => :text
  end

  # POST / title=...
  def create
    page = params[:title].gsub(/[^a-z0-9]/i, '-').gsub(/--+/, '-').downcase
    File.open(html_file_path(page), 'w') do |file|
      file.puts "<h1>#{params[:title]}</h1>"
      file.puts File.read(Merb.dir_for(:view) / "pages" / "template.html")
    end

    redirect "/" / page
  end
  
  def update
    File.open(html_file_path(params[:page]), 'w') do |file|
      file.puts params[:content]
    end
    
    render "Updated"
  end

  def upload
    dir = assets_dir_path(params[:page])
    @images = []

    FileUtils.mkdir(dir) unless File.exists?(dir)
    (params[:files] || []).reject(&:blank?).each do |file|
      FileUtils.mv(file[:tempfile].path, dir / file[:filename])
      @images << '/assets' / params[:page] / file[:filename]
    end

    render :status => 201
  end
  
  protected
  def html_file_path(page)
    Merb.root_path("pages", "#{page}.html")
  end
  
  def assets_dir_path(page)
    Merb.dir_for(:public) / "assets" / page
  end
end
