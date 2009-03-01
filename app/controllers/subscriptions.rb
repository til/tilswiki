class Subscriptions < Application

  def show
    @page = params[:page]
    render :template => 'subscriptions/new', :layout => false
  end
  
  def create
    @subscription = Subscription.new(:email => params[:email], :page => params[:page])
    
    @subscription.save!

    render "OK", :status => 201
  end
  
  # Special action for requests like this:
  # GET /unsubscribe/a9879fdsafs
  def unsubscribe
    @subscription = Subscription.first(:secret => params[:secret])
    
    @subscription.destroy
    
    render
  end
end
