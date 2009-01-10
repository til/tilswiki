require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')

describe Pages, "upload action" do
  before(:each) do
    @response = dispatch_to(Pages, :upload)
  end

  it "should return 201" do
    @response.status.should == 201
  end
end


describe Pages, 'not found' do

  it "returns a 404" do
    request('/gibbsnich').status.should == 404
  end
end

given "a Page exists" do
  @page = Page.new
  @page.body = "This is da body"
  @page.stub!(:updated_at).and_return(1.day.ago)
  Page.stub!(:first).and_return(@page)
end


describe Pages, :given => "a Page exists" do
  before do
    @response = request("/" + @page.handle)
  end

  it "includes last modified header" do
    @response.headers.should have_key('Last-modified')
  end
  
  it "sets last modified header to updated_at of page" do
    @response.headers['Last-modified'].should == @page.updated_at.to_time.httpdate
  end

  it "returns full html when not xhr request" do
    @response.should have_tag('html body')
  end

  it "includes editable element" do
    @response.should have_tag('html body div#wysiwyg')
  end
end

describe Page, 'xhr show', :given => 'a Page exists' do
  before do
    @response = get("/" + @page.handle) do |controller|
      controller.request.should_receive(:ajax?).and_return(true)
    end
  end

  it "does not include full html" do
    @response.body.should_not match(/<html/i)
    @response.body.should_not match(/<body/i)
  end

  it "does not include editable element" do
    @response.should_not have_tag('div#wysiwyg')
  end
  
  it "is only the body" do
    @response.body.should == @page.body
  end
end
