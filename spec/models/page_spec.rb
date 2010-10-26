require "spec_helper"

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
end

describe Page, "create" do
  before do
    @page = Page.create :body => 'abc', :handle => 'zacke'
  end
  
  it "can set body and handle" do
    @page.body.should   == 'abc'
    @page.handle.should == 'zacke'
  end
end


describe Page, "relocate" do
  before(:each) do
    Page.all.each(&:destroy)
    OldHandle.all.each(&:destroy)
    @page = Page.new; @page.save
    @old_this = @page.old_handles.create(:name => 'old_this')
    
    @other = Page.new; @other.save
    @other.old_handles.create(:name => 'old_other')

    @handle = @page.handle.dup
  end

  it "returns true when successful" do
    @page.relocate('def').should be_true
  end

  it "sets the new handle" do 
    @page.relocate('def')
    @page.reload.handle.should  == 'def'
  end

  it "stores the old handle" do
    @page.relocate('def')

    @page.old_handles.map(&:to_s).should include(@handle)
  end

  it "returns false when handle taken by other page" do
    @page.relocate(@other.handle).should be_false
  end

  it "returns false when handle is taken by other old handle" do
    @page.relocate("old_other").should be_false
  end
  
  it "returns true when handle is taken by this page" do
    @page.relocate("old_this").should be_true
  end
end


describe Page, "relocate with many handles" do
  before do
    @page = Page.create
    10.times do |i|
      @page.old_handles.create(:name => "old_#{i}")
    end
  end

  it "returns false" do
    @page.relocate("straw").should be_false
  end
end


describe Page, "title" do
  
  it "is derived from the first h1 element of body" do
    @page = Page.new(:body => <<-HTML)
      fluff
      <h1>My 
          birthday
      </h1>
      more fluff
      <h1>a good party</h1>
      foo
    HTML
    
    @page.title.should == "My birthday"
  end

  it "also works with attributes in the h1" do
    @page = Page.new(:body => <<-HTML)
      <h1 type='font-color: red;'>My birthday</h1>
    HTML
    
    @page.title.should == "My birthday"
  end

  
  it "has a default when no h1 in body" do
    @page = Page.new
    @page.body = "nothing"

    @page.title.should == "A tilswiki page"
  end

  it "has a different default than the default body" do
    @page = Page.new

    @page.title.should == "A tilswiki page"
  end

  it "removes html" do
    @page = Page.new
    @page.body = "<h1>Foo <font style='color: red;'>Bar</font>  </h1>"

    @page.title.should == "Foo Bar"
  end
end


describe Page, "with numbered versions" do
  before(:each) do
    @page = Page.create
  end

  it "starts at number 1" do
    @page.version.number.should == 1
  end
  
  it "stores old versions" do
    @page.body = "foobar"
    @page.save

    @page.reload

    @page.versions.size.should == 2
  end

  it "has the body of the new version" do
    @page.body = "foobar"
    @page.save

    @page.reload

    @page.body.should == "foobar"
  end

  it "increases number for new versions" do
    @page.body = "foobar"
    @page.save

    @page.reload

    @page.version.number.should == 2
  end
end
