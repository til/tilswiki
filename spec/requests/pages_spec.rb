require File.join(File.dirname(__FILE__), '..', 'spec_helper.rb')

describe Pages, "upload action" do
  before(:each) do
    @response = dispatch_to(Pages, :upload, :handle => 'abc')
  end

  it "should return 201" do
    @response.status.should == 201
  end
end
