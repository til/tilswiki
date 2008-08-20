class Index < Merb::Controller

  def index
    render :template => 'index'
  end
end

class Pages < Merb::Controller

  def show
    if request.env['REQUEST_PATH'] =~ %r{/$}
      redirect '/' / params[:page]
    end

    @content = File.read(file_path(params[:page]))
    
    @title = if @content =~ %r{^\s*<h1>(.*?)</h1>}
               $1.gsub(/<[^>]+>/, '')
             else
               params[:page]
             end
    
    render :template => 'page'
    
  rescue Errno::ENOENT
    render "Not found", :status => 404, :format => :text
  end

  # POST / title=...
  def create
    page = params[:title].gsub(/[^a-z0-9]/i, '-').gsub(/--+/, '-').downcase
    File.open(file_path(page), 'w') do |file|
      file.puts "<h1>#{params[:title]}</h1>"
      file.puts File.read(Merb.dir_for(:views) / "views" / "template.html")
    end

    redirect "/" / page
  end
  
  def update
    File.open(file_path(params[:page]), 'w') do |file|
      file.puts params[:content]
    end
    
    render "Updated"
  end

  def upload
    dir = dir_path(params[:page])
    @images = []

    FileUtils.mkdir(dir) unless File.exists?(dir)
    (params[:files] || []).reject(&:blank?).each do |file|
      FileUtils.mv(file[:tempfile].path, dir / file[:filename])
      @images << '/' / params[:page] / file[:filename]
    end

    render :template => 'upload', :status => 201
  end
  
protected
  def file_path(page)
    Merb.dir_for(:public) / "pages" / "#{page}.html"
  end
  
  def dir_path(page)
    Merb.dir_for(:public) / "pages" / page
  end
end


class Assets < Merb::Controller
  
  def show
    # TODO find a way to send file with correct content type
    send_file Merb.dir_for(:public) / "pages/" / params[:page] / params[:asset]
  end
end
