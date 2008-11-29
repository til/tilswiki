class Base62
  
  def self.rand
    (0..10).map do
      "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')[Kernel.rand(26 + 26 + 10)]
    end.join
  end
end
