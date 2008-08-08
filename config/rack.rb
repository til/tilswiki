
public = Proc.new do |env|
  request = Merb::Request.new(env)
  file = Merb.dir_for(:public) / "public" / File.split(request.path).last
  if File.exists?(file) && File.file?(file)
    extension = file.split('.').last
    [
      200,
      { "Content-Type" => {
          "js"  => "text/javascript",
          "css" => "text/css",
          "png" => "image/png",
        }[extension]},
      File.read(file)
    ]
  else
    [404, {}, "Not found"]
  end
end

run Rack::Cascade.new [public, Merb::Rack::Application.new]
