require File.join( File.dirname(__FILE__), '..', "spec_helper" )

describe Version do
  before do
    @version = Version.generate
  end

  it "has a number" do
    @version.should 
  end
end
