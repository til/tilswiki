class Index < Merb::Controller

  def _template_location(action, type = nil, controller = controller_name)
    controller == "layout" ? "layout.#{action}.#{type}" : "#{action}.#{type}"
  end

  def index
    render
  end
end

class Pages < Merb::Controller

  def show
    @content = File.read(path(params[:page]))
    
    render :template => 'page'
    
  rescue Errno::ENOENT
    render "Not found", :status => 404, :format => :text
  end
  
  def update
    File.open(path(params[:page]), 'w') do |file|
      file.puts params[:content]
    end
    
    # Useless sleep to make net waiting time more realistic
    sleep 3

    render "Updated"
  end
  
protected
  def path(page)
    Merb.dir_for(:public) / "pages" / page
  end
end
