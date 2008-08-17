class Index < Merb::Controller

  def index
    render :template => 'index'
  end
end

class Pages < Merb::Controller

  def show
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
    if ! File.exists?(dir_path(params[:page]))
      FileUtils.mkdir dir_path(params[:page])
    end
    
    destination_file = dir_path(params[:page]) / params[:image][:filename]

    FileUtils.mv(
      params[:image][:tempfile].path,
      destination_file
    )
        
    original = headers['Location'] = (request.protocol + request.host) / "pages" / params[:page] / params[:image][:filename]
    render "Created <a class='original' href='#{original}'>image</a>", :status => 201
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
