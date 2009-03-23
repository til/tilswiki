class NotificationsMailer < Merb::MailController

  def notify
    @page = params[:subscription].page
    @page_url = "http://wiki.tils.net/#{params[:subscription].page.handle}"
    @unsubscribe_url = "http://wiki.tils.net/unsubscribe/#{params[:subscription].secret}"

    render_mail
  end
end
