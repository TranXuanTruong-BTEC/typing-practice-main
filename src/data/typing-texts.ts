export interface TypingText {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  language: 'vi' | 'en' | 'jp' | 'fr' | 'es' | 'zh' | 'de' | 'ru' | 'it' | 'ko';
}

export const typingTexts: TypingText[] = [
  {
    id: '1',
    title: 'Công nghệ thông tin',
    category: 'Công nghệ',
    difficulty: 'easy',
    language: 'vi',
    text: 'Công nghệ thông tin đã thay đổi cách chúng ta sống và làm việc. Internet kết nối mọi người trên toàn thế giới. Máy tính và điện thoại thông minh trở thành công cụ không thể thiếu trong cuộc sống hiện đại.'
  },
  {
    id: '2',
    title: 'Lập trình web',
    category: 'Công nghệ',
    difficulty: 'medium',
    language: 'vi',
    text: 'Lập trình web là quá trình tạo ra các trang web và ứng dụng web. HTML, CSS và JavaScript là những ngôn ngữ cơ bản nhất. React, Vue và Angular là các framework phổ biến cho frontend development.'
  },
  {
    id: '3',
    title: 'Trí tuệ nhân tạo',
    category: 'Công nghệ',
    difficulty: 'hard',
    language: 'vi',
    text: 'Trí tuệ nhân tạo là lĩnh vực khoa học máy tính tập trung vào việc tạo ra các hệ thống có khả năng thực hiện các tác vụ thường đòi hỏi trí thông minh của con người. Machine learning và deep learning là những nhánh quan trọng của AI.'
  },
  {
    id: '4',
    title: 'Văn học Việt Nam',
    category: 'Văn học',
    difficulty: 'easy',
    language: 'vi',
    text: 'Văn học Việt Nam có lịch sử lâu đời và phong phú. Từ thơ ca dân gian đến văn học hiện đại, mỗi thời kỳ đều có những tác phẩm tiêu biểu. Truyện Kiều của Nguyễn Du là kiệt tác văn học dân tộc.'
  },
  {
    id: '5',
    title: 'Thơ ca',
    category: 'Văn học',
    difficulty: 'medium',
    language: 'vi',
    text: 'Thơ ca là nghệ thuật sử dụng ngôn từ một cách có nhịp điệu và hình ảnh. Thơ Việt Nam có nhiều thể loại như thơ lục bát, thơ Đường luật, thơ tự do. Mỗi bài thơ đều chứa đựng cảm xúc và tư tưởng của tác giả.'
  },
  {
    id: '6',
    title: 'Tin tức thời sự',
    category: 'Tin tức',
    difficulty: 'easy',
    language: 'vi',
    text: 'Tin tức thời sự cập nhật những sự kiện quan trọng trong nước và quốc tế. Báo chí đóng vai trò quan trọng trong việc thông tin và định hướng dư luận. Độc giả cần có khả năng phân tích và đánh giá thông tin.'
  },
  {
    id: '7',
    title: 'Technology News',
    category: 'Technology',
    difficulty: 'medium',
    language: 'en',
    text: 'Technology continues to evolve at an unprecedented pace. Artificial intelligence and machine learning are transforming industries worldwide. Companies are investing heavily in digital transformation to stay competitive in the modern market.'
  },
  {
    id: '8',
    title: 'Programming Basics',
    category: 'Technology',
    difficulty: 'easy',
    language: 'en',
    text: 'Programming is the process of creating instructions for computers to follow. Popular programming languages include Python, JavaScript, and Java. Learning to code opens up many career opportunities in the tech industry.'
  },
  {
    id: '9',
    title: 'Web Development',
    category: 'Technology',
    difficulty: 'hard',
    language: 'en',
    text: 'Web development involves creating websites and web applications. Frontend development focuses on user interface and experience. Backend development handles server-side logic and database management. Full-stack developers work on both frontend and backend.'
  },
  {
    id: '10',
    title: 'Business and Finance',
    category: 'Business',
    difficulty: 'medium',
    language: 'en',
    text: 'Business and finance are fundamental aspects of the global economy. Companies must adapt to changing market conditions and consumer preferences. Financial literacy is essential for making informed investment decisions.'
  },
  {
    id: '11',
    title: '日本の文化',
    category: '文化',
    difficulty: 'easy',
    language: 'jp',
    text: '日本の文化はとても豊かで多様です。伝統的な祭りや食べ物、芸術は世界中で有名です。桜の季節には多くの人が花見を楽しみます。'
  },
  {
    id: '12',
    title: 'プログラミング入門',
    category: 'テクノロジー',
    difficulty: 'medium',
    language: 'jp',
    text: 'プログラミングはコンピュータに指示を与えるための技術です。PythonやJavaScriptなど、さまざまな言語があります。'
  },
  {
    id: '13',
    title: 'Culture française',
    category: 'Culture',
    difficulty: 'easy',
    language: 'fr',
    text: 'La culture française est connue pour sa gastronomie, son art et sa littérature. Paris est souvent appelée la ville de la lumière.'
  },
  {
    id: '14',
    title: 'Introduction à la programmation',
    category: 'Technologie',
    difficulty: 'medium',
    language: 'fr',
    text: 'La programmation consiste à écrire des instructions pour les ordinateurs. Les langages populaires incluent Python, JavaScript et Java.'
  },
  {
    id: '15',
    title: 'Cultura española',
    category: 'Cultura',
    difficulty: 'easy',
    language: 'es',
    text: 'La cultura española es famosa por el flamenco, la paella y las fiestas tradicionales. España tiene una rica historia y diversidad regional.'
  },
  {
    id: '16',
    title: 'Introducción a la programación',
    category: 'Tecnología',
    difficulty: 'medium',
    language: 'es',
    text: 'La programación es el proceso de crear instrucciones para que las computadoras las sigan. Python y JavaScript son lenguajes populares.'
  },
  {
    id: '17',
    title: '中国文化',
    category: '文化',
    difficulty: 'easy',
    language: 'zh',
    text: '中国有着悠久的历史和丰富的文化。春节是中国最重要的传统节日之一。'
  },
  {
    id: '18',
    title: '编程基础',
    category: '技术',
    difficulty: 'medium',
    language: 'zh',
    text: '编程是为计算机编写指令的过程。常见的编程语言有Python、JavaScript等。'
  },
  {
    id: '19',
    title: 'Deutsche Kultur',
    category: 'Kultur',
    difficulty: 'easy',
    language: 'de',
    text: 'Deutschland ist bekannt für seine Dichter und Denker. Das Oktoberfest ist eines der berühmtesten Feste der Welt.'
  },
  {
    id: '20',
    title: 'Programmierung Grundlagen',
    category: 'Technologie',
    difficulty: 'medium',
    language: 'de',
    text: 'Programmierung bedeutet, Anweisungen für Computer zu schreiben. Beliebte Sprachen sind Python und JavaScript.'
  },
  {
    id: '21',
    title: 'Русская культура',
    category: 'Культура',
    difficulty: 'easy',
    language: 'ru',
    text: 'Россия славится своей богатой историей и литературой. Зима в России бывает очень холодной.'
  },
  {
    id: '22',
    title: 'Основы программирования',
    category: 'Технологии',
    difficulty: 'medium',
    language: 'ru',
    text: 'Программирование — это процесс создания инструкций для компьютеров. Популярные языки — Python и JavaScript.'
  },
  {
    id: '23',
    title: 'Cultura italiana',
    category: 'Cultura',
    difficulty: 'easy',
    language: 'it',
    text: "L'Italia è famosa per la sua cucina, l'arte e la moda. Roma è una delle città più antiche del mondo."
  },
  {
    id: '24',
    title: 'Introduzione alla programmazione',
    category: 'Tecnologia',
    difficulty: 'medium',
    language: 'it',
    text: 'La programmazione consiste nello scrivere istruzioni per i computer. Python e JavaScript sono linguaggi molto diffusi.'
  },
  {
    id: '25',
    title: '한국 문화',
    category: '문화',
    difficulty: 'easy',
    language: 'ko',
    text: '한국은 전통과 현대가 조화를 이루는 나라입니다. 한글은 세계에서 가장 과학적인 문자로 평가받고 있습니다.'
  },
  {
    id: '26',
    title: '프로그래밍 기초',
    category: '기술',
    difficulty: 'medium',
    language: 'ko',
    text: '프로그래밍은 컴퓨터에게 명령을 내리는 과정입니다. 파이썬과 자바스크립트는 인기 있는 언어입니다.'
  },
  {
    id: '27',
    title: 'Deep Learning Overview',
    category: 'Technology',
    difficulty: 'hard',
    language: 'en',
    text: 'Deep learning is a subset of machine learning that uses neural networks with many layers. It is used in image recognition, natural language processing, and more.'
  },
  {
    id: '28',
    title: '金融科技',
    category: '技术',
    difficulty: 'hard',
    language: 'zh',
    text: '金融科技正在改变银行和支付行业。区块链和人工智能是推动创新的关键技术。'
  },
  {
    id: '29',
    title: 'Littérature française moderne',
    category: 'Littérature',
    difficulty: 'hard',
    language: 'fr',
    text: "La littérature française moderne explore des thèmes variés, de l'existentialisme à la science-fiction."
  },
  {
    id: '30',
    title: 'スペインの歴史',
    category: '歴史',
    difficulty: 'hard',
    language: 'jp',
    text: 'スペインの歴史は多様で複雑です。ローマ帝国から現代まで、多くの変化がありました。'
  },
  {
    id: '31',
    title: 'Geschichte Deutschlands',
    category: 'Geschichte',
    difficulty: 'hard',
    language: 'de',
    text: 'Die Geschichte Deutschlands ist reich an Ereignissen, von der Antike bis zur Gegenwart.'
  },
  {
    id: '32',
    title: 'Letteratura italiana contemporanea',
    category: 'Letteratura',
    difficulty: 'hard',
    language: 'it',
    text: 'La letteratura italiana contemporanea affronta temi sociali, politici e culturali.'
  },
  {
    id: '33',
    title: 'Современная русская литература',
    category: 'Литература',
    difficulty: 'hard',
    language: 'ru',
    text: 'Современная русская литература отражает изменения в обществе и культуре России.'
  },
  {
    id: '34',
    title: '현대 한국 문학',
    category: '문학',
    difficulty: 'hard',
    language: 'ko',
    text: '현대 한국 문학은 사회적, 문화적 변화를 주제로 다양한 작품을 선보이고 있습니다.'
  }
];

export const getTextsByCategory = (category: string) => {
  return typingTexts.filter(text => text.category === category);
};

export const getTextsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return typingTexts.filter(text => text.difficulty === difficulty);
};

export const getTextsByLanguage = (language: 'vi' | 'en' | 'jp' | 'fr' | 'es' | 'zh' | 'de' | 'ru' | 'it' | 'ko') => {
  return typingTexts.filter(text => text.language === language);
};

export const getRandomText = () => {
  const randomIndex = Math.floor(Math.random() * typingTexts.length);
  return typingTexts[randomIndex];
}; 