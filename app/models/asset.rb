class Asset
  VERSIONS = [['thumbnail', '100x100'], ['small', '300x300'], ['medium', '450x450']]
  attr :filename, :page

  def self.create(page, file)
    asset = Asset.new(page)
    asset.filename = file['filename']

    dir = asset.storage_dir
    
    FileUtils.mkdir(dir) unless File.exists?(dir)
    
    FileUtils.mv(file['tempfile'].path, dir / file['filename'])
    asset.create_versions!

    return asset
  end
  
  def self.delete_all(page)
    FileUtils.rm_rf(storage_dir(page))
  end
  
  def initialize(page)
    @page = page
  end

  def create_versions!
    VERSIONS.each do |version, geometry|
      original.change_geometry(geometry) do |x, y, img|
        img.scale(x, y).write(storage_dir / version_name(version))
      end
    end
  end

  def version_paths
    VERSIONS.map(&:first).map do |version|
      if File.exist?("#{storage_dir}/#{basename}.#{version}.#{extension}")
        [version, "/assets/#{@page}/#{basename}.#{version}.#{extension}"]
      else
        nil
      end
    end.compact << ['original', "/assets/#{@page}/#{basename}.#{extension}"]
  end

  def original
    @original ||= Magick::Image.read(storage_dir / @filename).first
  end

  def self.storage_dir(page)
    Merb.dir_for(:public) / "assets" / page
  end

  def storage_dir
    Asset.storage_dir(@page)
  end

  def extension
    @filename =~ /\.(.+)$/ && $1
  end

  def basename
    @filename =~ /^(.+)\./ && $1
  end

  def version_name(version)
    "#{basename}.#{version}.#{extension}"
  end
end
