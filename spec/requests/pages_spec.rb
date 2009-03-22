require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')

describe Pages, "upload action" do
  before(:each) do
    @response = dispatch_to(Pages, :upload, :handle => 'abc')
  end

  it "should return 201" do
    @response.status.should == 201
  end
end


describe Pages, "relocate" do
  before do
    @page = Page.new
    @page.save
    @handle = @page.handle.dup
  end
  
  it "redirects to new URL" do
    @response = request('/', :method => 'PUT', :params => { :handle => @handle, :new_handle => 'def' })

    @response.should redirect_to('/def')
  end
  
  it "relocates the page" do
    Page.stub!(:get_by_handle!).and_return(@page)

    @page.should_receive(:relocate).with('def')

    @response = request('/', :method => 'PUT', :params => { :handle => @handle, :new_handle => 'def' })
  end
end


describe Pages, "requesting an old page" do
  before do
    @page = Page.new; @page.handle = 'def'; @page.save
    @page.old_handles.create(:name => 'abc')

    @response = request('/abc')
  end

  it "redirects to new page" do
    @response.should redirect_to('/def')
  end
  
  it "redirects permanently" do
    @response.status.should == 301
  end
end


describe Pages, "new URL suggestion" do
  before do
    @page = Page.new; @page.body = "<h1>My cool car</h1>"; @page.save

    @response = dispatch_to(Pages, :show, :handle => @page.handle)
  end

  it "uses title of page" do
    @response.should have_tag("input[name=new_handle]") do |input|
      input.to_s.should match(/value="my_cool_car"/)
    end
  end
end
