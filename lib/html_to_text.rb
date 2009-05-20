def html_to_text(html)
  Nokogiri::HTML(html).text.gsub(/\s+/, ' ').strip
end
