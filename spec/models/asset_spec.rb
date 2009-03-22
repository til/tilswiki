require File.join( File.dirname(__FILE__), '..', "spec_helper" )

describe Asset, "creation from uploaded tempfile" do
  before do
    @page = 'asset_spec'
    @storage_dir = Asset.storage_dir(@page)

    FileUtils.cp(Merb.root / 'spec' / 'files' / 'test.jpg', '/tmp/asset_spec.jpg')

    @file = {
      "size"         => 877838,
      "content_type" => "image/jpeg",
      "filename"     => "panzer.jpg",
      "tempfile"     => File.open('/tmp/asset_spec.jpg')
    }

    @asset = Asset.create(@page, @file)
  end

  after do
    #Asset.delete_all(@page)
  end

  it "should create the storage dir" do
    File.exists?(@storage_dir).should be_true
  end

  it "should move the uploaded file to storage dir" do
    File.exists?(@storage_dir / @file['filename']).should be_true
  end

  it "should create a thumbnail version" do
    File.exists?(@storage_dir / 'panzer.thumbnail.jpg').should be_true
  end

  it "should resize thumbnail and keep aspect ratio" do
    thumb = Magick::Image.read(@storage_dir / 'panzer.thumbnail.jpg').first
    thumb.columns.should == 100
    thumb.rows.should == 75
  end

  it "should create a small version" do
    File.exists?(@storage_dir / 'panzer.small.jpg').should be_true
  end

  it "should create a medium version" do
    File.exists?(@storage_dir / 'panzer.medium.jpg').should be_true
  end

  it "should have a list of all versions with paths" do
    @asset.versions.map(&:first).should == ['thumbnail', 'small', 'medium', 'large', 'original']
    @asset.versions.map { |v| v[1] }.should  == [
      '/assets/asset_spec/panzer.thumbnail.jpg',
      '/assets/asset_spec/panzer.small.jpg',
      '/assets/asset_spec/panzer.medium.jpg',
      '/assets/asset_spec/panzer.large.jpg',
      '/assets/asset_spec/panzer.jpg'
    ]
  end

end
