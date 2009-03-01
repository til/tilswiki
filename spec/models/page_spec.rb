require File.join( File.dirname(__FILE__), '..', "spec_helper" )

describe Page do
  before do
    @page = Page.new
  end

  after do
    Version.all.each { |v| v.destroy }
  end

  it "assigns a base62 string as handle" do
    @page.handle.should match(/^[a-z0-9]+$/i)
  end

  it "assigns random handles" do
    @page.handle.should_not == Page.new.handle
  end

  it "can be saved" do
    @page.save
  end

  it "can set the body" do
    @page.body = "holler"
    @page.body.should == "holler"
  end

  it "saves new version when body is changed" do
    @page.body = "holler"
    @page.save
    
    Page.get(@page.id).body.should == "holler"
  end
  
  it "has one unsaved version before save" do
    @page.versions.length.should == 1
    @page.versions.first.should be_new_record
  end

  it "has one version after save" do
    @page.save

    @page.versions.length.should == 1
  end

  it "has a dummy body" do
    @page.body.should_not be_blank
  end

  it "has two versions after two saves" do
    @page.body = "foo"; @page.save
    @page.body = "foo"; @page.save

    @page.versions.size.should == 2
  end
  
  it "returns latest versions created_at for updated_at" do
    @page.save
    
    @page.updated_at.should_not be_nil
    @page.updated_at.should == @page.latest_version.created_at
  end
end

